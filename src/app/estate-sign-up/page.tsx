import { Suspense } from 'react';
import { EstateSignUp } from '@/components/estate-sign-up';

export default function EstateSignUpPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Loading...</div>}>
        <EstateSignUp />
      </Suspense>
    </div>
  );
}