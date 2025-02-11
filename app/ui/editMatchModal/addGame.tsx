import { useState } from 'react';

type AddGameProps = {
  onSubmit: (name: string) => void;
}
export default function AddGame({ onSubmit }: AddGameProps) {
  const [name, setName] = useState('');
  return (
    <div className='grid grid-cols-[1fr_auto] gap-2'>
      <input autoFocus type="text" value={name} onChange={(e) => setName(e.target.value)}></input>
      <button onClick={() => onSubmit(name)}>Add</button>
    </div>
  );
}