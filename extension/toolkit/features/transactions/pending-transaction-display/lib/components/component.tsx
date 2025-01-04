import { ErrorBoundary, useStorage, useTransactionMutationEvent } from '@extension/shared';
import type { Transaction } from '@extension/monarch';
import { useSuspenseGetTransactionsList } from '@extension/monarch';
import { Suspense, useEffect } from 'react';
import { featureStorage } from '../feature-storage';
import { Spinner } from '@extension/ui';
import { Virtuoso } from 'react-virtuoso';

export interface TransactionRowProps {
  item: Transaction;
}

const TransactionRow = ({ item }: TransactionRowProps) => {
  return (
    <div className="TransactionsList__TransactionRowContainer flex flex-row items-center justify-between text-clip border-b border-b-border">
      <div className="TransactionsListRow__Root -m-px w-4/5 shrink grow basis-0">
        <div className="TransactionsList__TransactionRow flex flex-row flex-nowrap content-stretch items-center justify-start gap-1 px-2 py-[6px]">
          <div className="TransactionOverview__Root flex w-full flex-row items-center justify-between px-[18px] py-[14px]">
            <div className="TransactionMerchantSelect__Root flex w-1/4 flex-row items-center">
              <div
                className="mr-1 size-5 shrink-0 rounded-full"
                style={{
                  backgroundImage: `url(${item.merchant.logoUrl})`,
                  backgroundPositionY: 'center',
                  backgroundPositionX: 'center',
                  backgroundSize: 'cover',
                }}
              />
              <span className="truncate">{item.merchant.name}</span>
            </div>
            <div className="TransactionCategorySelect__Root w-1/5 shrink grow basis-0">
              <div className="block truncate">
                <span>{item.category.icon}</span>
                <span>{item.category.name}</span>
              </div>
            </div>

            <a
              href="/transactions"
              className="TransactionAccount__Root flex w-1/5 shrink grow basis-0 flex-row items-center justify-between px-2 text-text"
              type="button"
              title={item.account.displayName}>
              <div className="TransactionLinkButton__ChildrenContainer-sc-18tqhg9-1 hDZmpo">
                <div className="AccountLogo__Root-ysfizm-0 jXlxzl"></div>
                <img
                  src={item.account.logoUrl}
                  aria-hidden="true"
                  alt=""
                  className="AccountLogo__InvisibleImg-ysfizm-1 fAYuLT"></img>
                <span className="TransactionAccount__Name-mav31r-0 dUcLPZ">{item.account.displayName}</span>
              </div>
              <span></span>
            </a>
            <div className="TransactionOverview__Amount flex w-1/5 shrink-0 grow basis-[18%] flex-row content-stretch">
              <div>{item.amount}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export function PendingTransactions() {
  const { enabled } = useStorage(featureStorage);

  const response = useTransactionMutationEvent();
  const { data, error, refetch } = useSuspenseGetTransactionsList({
    //limit:5,
    filters: {
      isPending: true,
    },
  });

  useEffect(() => {
    refetch();
  }, [response]);

  if (!enabled || error || data.allTransactions.totalCount === 0) {
    return <></>;
  }

  return (
    <div className="flex flex-col justify-start bg-widget">
      <Virtuoso
        style={{ height: Math.min(data.allTransactions.totalCount * 56, 220) }}
        data={data.allTransactions.results}
        itemContent={(_, item) => <TransactionRow item={item} />}></Virtuoso>
    </div>
  );
}

export function PendingTransactionList() {
  const { enabled } = useStorage(featureStorage);

  return (
    <>
      {enabled ? (
        <ErrorBoundary fallback={<div>Error retrieving pending transactions</div>}>
          <div
            id="mmtk-pending-transactions"
            className="flex flex-col place-content-stretch rounded-lg px-4 pb-4 text-text">
            <Suspense
              fallback={
                <div className="m-6 flex flex-row justify-center">
                  <Spinner />
                </div>
              }>
              <PendingTransactions />
            </Suspense>
          </div>
        </ErrorBoundary>
      ) : (
        <></>
      )}
    </>
  );
}
