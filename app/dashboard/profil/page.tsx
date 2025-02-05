import { auth } from '@/auth';
import { fetchProfileByUserId } from '@/src/applications/actions/profile/fetUserProfile';
import ProfileForm from '@/src/presentation/components/profil/profil-form';
import { lusitana } from '@/src/presentation/components/shared/fonts';

export default async function ProfilePage() {
  const session = await auth();
  let profileData = null;

  if (session?.user?.id) {
    const data = await fetchProfileByUserId(session.user.id);
    if (data) {
      profileData = {
        first_name: data.first_name,
        last_name: data.last_name,
        address: data.address,
        telephone: data.telephone,
        date_of_birth: data.date_of_birth.toISOString().split('T')[0],
      };
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className={`${lusitana.className} text-2xl text-center mb-6`}>Profile Settings</h1>
      <ProfileForm initialData={profileData} />
    </div>
  );
}
