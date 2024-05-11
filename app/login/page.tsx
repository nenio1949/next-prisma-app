import { Suspense } from 'react';
import Form from './form';

export default function Login() {
  return (
    <Suspense>
      <Form />
    </Suspense>
  );
}
