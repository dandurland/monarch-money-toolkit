import { EnabledSettings, useStorage } from '@extension/shared';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  MultipleSelector,
  Option,
} from '@extension/ui';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { featureStorage } from '../feature-storage';
import { useMemo, useState } from 'react';
import { useSuspenseGetAccounts } from '@extension/monarch';
import { isNil } from '@extension/core';

const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
});

const FormSchema = z.object({
  depositoryAccounts: z.array(optionSchema).min(1),
  creditAccounts: z.array(optionSchema).min(1),
});

export function EffectiveBalanceFeatureSettings() {
  const settings = useStorage(featureStorage);
  if (isNil(settings.depositoryAccountIds)) settings.depositoryAccountIds = [];
  if (isNil(settings.creditAccountIds)) settings.creditAccountIds = [];

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [selectedDepositoryAccounts, setSelectedDepositoryAccounts] = useState<Option[]>([]);
  const [selectedCreditAccounts, setSelectedCreditAccounts] = useState<Option[]>([]);
  const [depositoryAccounts, setDepositoryAccounts] = useState<Option[]>([]);
  const [creditAccounts, setCreditAccounts] = useState<Option[]>([]);

  const { data, refetch } = useSuspenseGetAccounts();

  const selectedDepository: Option[] = [];
  const selectedCredit: Option[] = [];

  useMemo(() => {
    const da: Option[] = [];
    const ca: Option[] = [];
    for (const account of data.accounts) {
      const item: Option = { value: account.id, label: account.displayName };

      switch (account.type.name) {
        case 'depository': {
          da.push(item);
          if (settings.depositoryAccountIds.includes(account.id)) {
            selectedDepository.push(item);
          }
          break;
        }
        case 'credit': {
          ca.push(item);
          if (settings.creditAccountIds.includes(account.id)) {
            selectedCredit.push(item);
          }
          break;
        }
      }
    }

    setDepositoryAccounts(da);
    setCreditAccounts(ca);
    setSelectedDepositoryAccounts(selectedDepository);
    setSelectedCreditAccounts(selectedCredit);
  }, [data]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    /*setLoading(true);

    setTimeout(() => {
      setLoading(false);
      toast({
        title: 'Your submitted data',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });
    }, 500);*/
    console.log('submit');
  }

  //commandProps={{ className: "w-2/3" }}
  return (
    <EnabledSettings featureStorage={featureStorage}>
      <Card className={settings.enabled ? '' : 'pointer-events-none opacity-40'}>
        <CardHeader>
          <CardTitle>Effective Balance</CardTitle>
          <CardDescription>
            Display total of configured credit account balances as a percentage of configured depository accounts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
              <FormField
                control={form.control}
                name="depositoryAccounts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Depository Accounts</FormLabel>
                    <FormControl>
                      <MultipleSelector
                        {...field}
                        defaultOptions={depositoryAccounts}
                        placeholder="Select depository account(s)"
                        emptyIndicator={
                          <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                            no results found.
                          </p>
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="creditAccounts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credit Accounts</FormLabel>
                    <FormControl>
                      <MultipleSelector
                        {...field}
                        defaultOptions={creditAccounts}
                        placeholder="Select credit account(s)"
                        emptyIndicator={
                          <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                            no results found.
                          </p>
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <button type="submit">Submit</button>
            </form>
          </Form>
          <div className="flex flex-col items-center">
            <span className="flex flex-col items-center justify-center gap-2 w-3/4">
              <MultipleSelector
                value={selectedDepositoryAccounts}
                onChange={setSelectedDepositoryAccounts}
                defaultOptions={depositoryAccounts}
                placeholder="Select depository accounts"
                disabled={!settings.enabled}></MultipleSelector>

              <MultipleSelector
                value={selectedCreditAccounts}
                onChange={setSelectedCreditAccounts}
                defaultOptions={creditAccounts}
                placeholder="Select credit accounts"
                disabled={!settings.enabled}></MultipleSelector>
            </span>
          </div>
        </CardContent>
      </Card>
    </EnabledSettings>
  );
}
