import { useState } from 'react';
import styles from './DynamicEditForm.module.scss';
import { IoClose, IoAdd } from 'react-icons/io5';
import genericStyles from '../../generic-styles.module.scss';

interface DynamicEditFormProps {
  name: string;
  values: string[];
  handleDynamicInput: (name: string, newValues: string[]) => void;
  className?: string;
}

const DynamicEditForm = ({
  name,
  values,
  className,
  handleDynamicInput,
}: DynamicEditFormProps) => {
  const handleFormChange = (
    idx: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.persist();
    const newValues = [...values];
    newValues.splice(idx, 1, event.target.value);
    handleDynamicInput(name, [...newValues]);
  };

  const handleAddFields = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    handleDynamicInput(name, [...values, '']);
  };

  const handleRemoveFields = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    field: string
  ) => {
    e.preventDefault();
    const index = values.indexOf(field);
    const newValues = [...values];
    newValues.splice(index, 1);
    handleDynamicInput(name, [...newValues]);
  };

  return (
    <div className={`${styles.dynamicFormContainer} ${className || ''}`}>
      {values.map((input, index) => {
        return (
          <div className={styles.dynamicFormInputContainer} key={index}>
            <input
              className={genericStyles.inputBar}
              name={index.toString()}
              placeholder='Enter Value'
              value={input}
              onChange={(event) => handleFormChange(index, event)}
            />
            <button
              className={styles.dynamicFormRemoveButton}
              onClick={(e) => handleRemoveFields(e, input)}
            >
              <IoClose />
            </button>
          </div>
        );
      })}
      <button onClick={handleAddFields} className={styles.dynamicFormAddButton}>
        <span>Add More</span>
        <IoAdd />
      </button>
    </div>
  );
};

export default DynamicEditForm;
