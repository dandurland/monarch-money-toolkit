import { useStorage } from '@extension/shared';
import type { Option } from '@extension/ui';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  MultipleSelector,
  Spinner,
  Toaster,
  useToast,
} from '@extension/ui';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFormState } from 'react-hook-form';
import * as z from 'zod';

import { featureStorage } from '../feature-storage';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSuspenseGetAccounts } from '@extension/monarch';
import { useBlocker } from '@tanstack/react-router';

const settingsSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
});

const FormSchema = z.object({
  depositoryAccounts: z.array(settingsSchema).min(1, {
    message: 'At least one depository account must be selected',
  }),
  creditAccounts: z.array(settingsSchema).min(1, {
    message: 'At least one credit account must be selected',
  }),
});

type FormValues = z.infer<typeof FormSchema>;

function Settings() {
  const { toast } = useToast();
  const { depositoryAccountIds, creditAccountIds } = useStorage(featureStorage);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onChange',
  });

  const [isSaving, setIsSaving] = useState(false);
  const { isDirty, isValid } = useFormState({ control: form.control });
  const [depositoryAccounts, setDepositoryAccounts] = useState<Option[]>([]);
  const [creditAccounts, setCreditAccounts] = useState<Option[]>([]);

  useBlocker({
    shouldBlockFn: async () => {
      if (isValid && !isDirty) {
        return false;
      }

      if (!isValid && !(await featureStorage.isValid())) {
        const shouldLeave = confirm(
          'Effective balance settings are not valid. If you leave the feature will be disabled. Are you sure you want to leave?',
        );
        if (!shouldLeave) {
          return true;
        }

        featureStorage.disable();
        return true;
      }

      const shouldLeave = confirm('You have unsaved changes. Are you sure you want to leave?');
      return !shouldLeave;
    },
    enableBeforeUnload() {
      if (isValid && !isDirty) {
        return false;
      }

      return true;
    },
  });

  const { data } = useSuspenseGetAccounts();

  useMemo(() => {
    const selectedDepository: Option[] = [];
    const selectedCredit: Option[] = [];
    const depositoryAccounts: Option[] = [];
    const creditAccounts: Option[] = [];

    data.accounts.forEach(account => {
      const item: Option = { value: account.id, label: account.displayName };

      switch (account.type.name) {
        case 'depository': {
          depositoryAccounts.push(item);
          if (depositoryAccountIds.length === 0 || depositoryAccountIds.includes(account.id)) {
            selectedDepository.push(item);
          }
          break;
        }
        case 'credit': {
          creditAccounts.push(item);
          if (creditAccountIds.length === 0 || creditAccountIds.includes(account.id)) {
            selectedCredit.push(item);
          }
          break;
        }
      }
    });

    setDepositoryAccounts(depositoryAccounts);
    setCreditAccounts(creditAccounts);
    form.setValue('depositoryAccounts', selectedDepository);
    form.setValue('creditAccounts', selectedCredit);
    featureStorage.enable();
  }, [data]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSaving(true);

    const timer = setTimeout(async () => {
      try {
        await featureStorage.patch({
          enabled: true,
          depositoryAccountIds: data.depositoryAccounts.map((account: Option) => account.value),
          creditAccountIds: data.creditAccounts.map((account: Option) => account.value),
        });

        toast({ description: 'Settings Saved!' });
        form.reset({}, { keepValues: true });
      } finally {
        setIsSaving(false);
      }

      clearTimeout(timer);
    }, 200);
  }

  return (
    <fieldset disabled={isSaving}>
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
    </fieldset>
  );
}

export function EffectiveBalanceFeatureSettings({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    if (!enabled) {
      featureStorage.disable();
    }
  }, [enabled]);

  return (
    <Suspense
      fallback={
        <div className="m-6 flex flex-row justify-center">
          <Spinner />
        </div>
      }>
      {enabled && <Settings />}
    </Suspense>
  );
}
