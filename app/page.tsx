import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/standings')
  return (
    <div></div>
  );
}
