import { PropertyManagement } from '@/components/property-management';
import { isAddress, getAddress } from 'viem';

export default function PropertyManagementPage({ params }: { params: { address: string } }) {
  // Validate and normalize the address
  if (!isAddress(params.address)) {
    return <div>Invalid property address</div>;
  }

  const propertyAddress = getAddress(params.address);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Manage Your Property</h1>
      <PropertyManagement propertyAddress={propertyAddress} />
    </div>
  );
}