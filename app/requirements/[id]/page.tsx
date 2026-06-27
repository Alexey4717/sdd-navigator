// @req SCD-DET-001
// @req SCD-STATE-001
import { notFound } from 'next/navigation';
import { getRequirement, listRequirements } from '@/lib/api';
import { DataError } from '@/components/DataError/DataError';
import { RequirementDetail } from '@/components/RequirementDetail/RequirementDetail';

export const revalidate = 300;

export async function generateStaticParams() {
  const result = await listRequirements();
  if (!result.ok) return [];
  return result.data.map((req) => ({ id: req.id }));
}

interface RequirementDetailPageProps {
  params: Promise<{ id: string }>;
}

const RequirementDetailPage = async ({
  params,
}: RequirementDetailPageProps) => {
  const { id } = await params;
  const result = await getRequirement(id);

  if (!result.ok) {
    if (result.error.kind === 'not_found') {
      notFound();
    }
    return (
      <DataError
        title="Failed to load requirement"
        message={result.error.message}
      />
    );
  }

  return <RequirementDetail requirement={result.data} />;
};

export default RequirementDetailPage;
