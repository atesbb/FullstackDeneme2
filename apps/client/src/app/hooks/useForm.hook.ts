import { useState, useEffect } from 'react';
import { showNotification } from '../misc/showNotification';

export type FormErrors<T> = Partial<{ [Property in keyof T]: string }>;

export const useForm = <T>(
  callback: () => Promise<Response>,
  validate: (values: T) => FormErrors<T>
) => {
  const [values, setValues] = useState({} as T);
  const [errors, setErrors] = useState({} as FormErrors<T>);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      callback()
        .then((res) => {
          if (res?.status < 400) {
            showNotification('success', 'Success');
          }
          return res?.json();
        })
        .then((data) => {
          if (data?.statusCode === 400) {
            const requestErrors = parseBadRequestErrors<T>(values, data);
            setErrors({ ...errors, ...requestErrors });
          }
          if (data?.code) {
            showNotification('danger', data?.message);
          }
        })
        .catch((err) => {
          showNotification('danger', err?.message);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors]);

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement | HTMLButtonElement>
  ) => {
    if (event) event.preventDefault();
    setIsSubmitting(true);
    setErrors(validate(values));
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    event.persist();
    setValues((values: T) => ({
      ...values,
      [event.target.name]: event.target.value,
    }));
  };

  return {
    handleChange,
    handleSubmit,
    values,
    errors,
    setErrors,
    setValues,
  };
};
function parseBadRequestErrors<T>(values: T, data: any): FormErrors<T> {
  const valueKeys = Object.keys(values);
  let requestErrors = {};
  valueKeys.forEach((key) => {
    if (data?.message) {
      const filteredErrors = data.message.filter((m: string) =>
        m.includes(key)
      );
      if (filteredErrors.length) {
        requestErrors = {
          ...requestErrors,
          [key]: filteredErrors.join(),
        };
      }
    }
  });
  return requestErrors;
}
