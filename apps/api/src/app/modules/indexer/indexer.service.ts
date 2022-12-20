import { LoggerService } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { Model, Document } from 'mongoose';
import { AlgoliaService } from 'nestjs-algolia';
import { projectConfig } from '../../configs/project.config';
import { IndexableModel } from '../../libs/base-classes/indexable-model.base';

const indexerInterval = projectConfig.indexerIntervalMs;

export abstract class IndexerService<T extends IndexableModel> {
  protected abstract readonly algoliaService: AlgoliaService;
  protected abstract readonly indexName: string;
  protected abstract readonly logger: LoggerService;
  protected abstract readonly model: Model<T>;

  /**
   * Additionally to executing this method during a HTTP request, it is executed periodically
   * every X minutes to avoid dual writes problem if indexing fails during a HTTP request
   */
  @Interval(indexerInterval)
  async index(documents?: (Document & T)[]): Promise<void> {
    const nonIndexedDocuments =
      documents ||
      (await this.model.find({ _indexed: false, _deleted: false }));

    if (!nonIndexedDocuments?.length) return;

    if (!documents)
      this.logger.log(
        `Found ${nonIndexedDocuments.length} non-indexed ${this.indexName}. Starting indexing...`
      );

    const documentsToIndex = nonIndexedDocuments.map((doc) => ({
      ...doc.toObject(),
      _indexed: undefined,
      _deleted: undefined,
      __v: undefined,
    }));

    const index = this.algoliaService.initIndex(this.indexName);
    const indexResult = await index.addObjects(documentsToIndex);

    indexResult.objectIDs.forEach((id: string, idx: number) => {
      nonIndexedDocuments[idx].objectID = id;
      nonIndexedDocuments[idx]._indexed = true;
    });

    await this.model.bulkSave(nonIndexedDocuments);

    if (!documents)
      this.logger.log(
        `Indexing finished. Indexed ${indexResult.objectIDs.length} ${this.indexName}.`
      );
  }

  async updateOne(objectID: string, document?: Partial<T>): Promise<void> {
    const index = this.algoliaService.initIndex(this.indexName);
    await index.partialUpdateObject({
      ...document,
      objectID,
    });
    await this.model.updateOne({ objectID }, { ...document, _indexed: true });
  }

  @Interval(indexerInterval)
  async delete(documents?: (Document & T)[]): Promise<void> {
    const markedForDeletion =
      documents || (await this.model.find({ _indexed: false, _deleted: true }));

    if (!markedForDeletion?.length) return;

    if (!documents)
      this.logger.log(
        `Found ${markedForDeletion.length} ${this.indexName} marked for deletion. Deleting from index and database...`
      );

    const objectIDs = markedForDeletion.map((doc) => doc.objectID);

    const index = this.algoliaService.initIndex(this.indexName);
    const deleted = await index.deleteObjects(objectIDs);

    const toDelete: string[] = [];
    markedForDeletion.forEach((doc) => {
      if (deleted.objectIDs.includes(doc.objectID)) {
        toDelete.push(doc._id);
      }
    });

    await this.model.deleteMany({ _id: { $in: toDelete } });

    if (!documents)
      this.logger.log(
        `Deleting finished. Deleted ${deleted.objectIDs.length} ${this.indexName}.`
      );
  }
}
