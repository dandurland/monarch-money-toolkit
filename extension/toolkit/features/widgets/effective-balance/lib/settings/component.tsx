import { EnabledSettings, ErrorBoundary, useStorage } from '@extension/shared';
import {
  Button,
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
  Toaster,
  useToast,
} from '@extension/ui';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { featureStorage } from '../feature-storage';
import { Suspense, useMemo, useState } from 'react';
import { useSuspenseGetAccounts } from '@extension/monarch';
import { isNil } from '@extension/core';

const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
});

const FormSchema = z.object({
  depositoryAccounts: z.array(optionSchema).min(1, {
    message: 'At least one depository account must be selected',
  }),
  creditAccounts: z.array(optionSchema).min(1, {
    message: 'At least one credit account must be selected',
  }),
});

type FormValues = z.infer<typeof FormSchema>;

function Settings() {
  const { toast } = useToast();
  const settings = useStorage(featureStorage);

  if (isNil(settings.depositoryAccountIds)) settings.depositoryAccountIds = [];
  if (isNil(settings.creditAccountIds)) settings.creditAccountIds = [];

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onChange',
  });

  const [enabled, setEnabled] = useState(settings.enabled);
  const [depositoryAccounts, setDepositoryAccounts] = useState<Option[]>([]);
  const [creditAccounts, setCreditAccounts] = useState<Option[]>([]);

  const { data } = useSuspenseGetAccounts();

  const selectedDepository: Option[] = [];
  const selectedCredit: Option[] = [];

  useMemo(() => {
    const da: Option[] = [];
    const ca: Option[] = [];

    data.accounts.forEach(account => {
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
    });

    setDepositoryAccounts(da);
    setCreditAccounts(ca);
    form.setValue('depositoryAccounts', selectedDepository);
    form.setValue('creditAccounts', selectedCredit);
  }, [data]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setEnabled(false);

    const timer = setTimeout(async () => {
      try {
        await featureStorage.patch({
          depositoryAccountIds: data.depositoryAccounts.map((account: Option) => account.value),
          creditAccountIds: data.creditAccounts.map((account: Option) => account.value),
        });

        toast({ description: 'Settings Saved!' });
        form.reset({}, { keepValues: true });
      } finally {
        setEnabled(true);
      }
    }, 200);

    clearTimeout(timer);
  }

  return (
    <EnabledSettings featureStorage={featureStorage}>
      <Card className={enabled ? '' : 'pointer-events-none opacity-40'}>
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
                        onChange={field.onChange}
                        defaultOptions={depositoryAccounts}
                        placeholder="Select depository account(s)"
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
                        onChange={field.onChange}
                        defaultOptions={creditAccounts}
                        placeholder="Select credit account(s)"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.formState.isValid && form.formState.isDirty && <Button type="submit">Save</Button>}
              <Toaster />
            </form>
          </Form>
        </CardContent>
      </Card>
    </EnabledSettings>
  );
}

export function EffectiveBalanceFeatureSettings() {
  return (
    <>
      <ErrorBoundary fallback={<div>Error in Over Budget feature settings</div>}>
        <Suspense fallback={<div>Loading...</div>}>
          <Settings />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
