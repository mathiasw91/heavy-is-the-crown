import Leader from './leader';
import Standing from './standing';
import { testdata as standings } from './testdata';

export default function Standings() {
  return (
    <div className='flex flex-col gap-2'>
      {standings.map(standing => (
        (standing.rank === 1) && (
          <Leader key={standing.rank} standing={standing} />
        ) || (
          <Standing key={standing.rank} standing={standing} />
        )
      ))}
    </div>
  );
}