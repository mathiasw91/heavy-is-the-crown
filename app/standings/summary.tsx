'use client'

import { use, useState } from 'react';
import { createPortal } from 'react-dom';
import CreateMatchModal from '../ui/editMatchModal/createMatchModal';
import { GetSummaryResult } from '../util/db';

type SummaryProps = {
  summaryPromise: Promise<GetSummaryResult>;
}

export function Summary({ summaryPromise }: SummaryProps) {
  const [showCreateMatchModal, setShowCreateMatchModal] = useState(false);
  const {amountplayed, lastplayed} = use(summaryPromise);
  return (
    <div className='flex justify-between border-secondary bg-primary border-t-2 pt-1 items-center'>
      <div>
        <div>{`${amountplayed} match${amountplayed === 1 ? '' : 'es'} played`}</div>
        <div>latest played: {lastplayed || 'never'}</div>
      </div>
      <button onClick={() => setShowCreateMatchModal(true)} className='h-fit'>Create one more</button>
      {showCreateMatchModal && createPortal(
        <CreateMatchModal onClose={() => setShowCreateMatchModal(false)}/>,
        document.body
      )}
    </div>
  );
}