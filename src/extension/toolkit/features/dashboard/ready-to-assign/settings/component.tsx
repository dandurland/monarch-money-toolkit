import * as React from 'react';
import { useState, useEffect, Suspense } from 'react';
import Select from 'react-select';
import { faBug, faCog, faStop, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toolkitStorage } from 'toolkit/core/common/storage';
import { CategoryGroupType, CategoryGroup, RolloverType, Category } from 'toolkit/core/monarch-money-api/model';
import { TypedDocumentNode, gql, useSuspenseQuery } from '@apollo/client';
import ToggleSwitch from 'toolkit/components/toggle-switch/component';

interface CategoryGroups {
  readonly categoryGroups: CategoryGroup[];
  readonly categories: Category[];
}

const ManageGetCategoryGroupsTypes: TypedDocumentNode<CategoryGroups> = gql`query ManageGetCategoryGroups {
  categoryGroups {
    id
    name
    order
    type
    __typename
  }
  categories(includeDisabledSystemCategories: true) {
    id
    name
    order
    icon
    isSystemCategory
    systemCategory
    isDisabled
    group {
      id
      type
      name
      __typename
    }
    rolloverPeriod {
      id
      type
      startMonth
      endMonth
      __typename
    }
    __typename
  }
}`;

interface CategoryOption {
  readonly id: string;
  readonly label: string;
}

interface GroupedCategoryOption {
  readonly id: string;
  readonly label: string;
  readonly options: readonly CategoryOption[];
}

export function ReadyToAssignSettings({ settings }: { settings: any }) {

  settings = settings ?? { enabled: false, includeOverspentCategories: true };

  const [isEnabled, setEnabled] = useState(settings.enabled);
  const [includeOverspentCategories, setIncludeOverspentCategories] = useState(settings.includeOverspentCategories);
  const [selectedRollupCategory, setSelectedRollupCategory] = useState<CategoryOption | null>(null);

  const categoryGroupData = useSuspenseQuery(ManageGetCategoryGroupsTypes);

  const rollupCategories: GroupedCategoryOption[] = [];
  let rollupCategory: CategoryOption;

  for (const group of categoryGroupData.data.categoryGroups.filter((x) => x.type === CategoryGroupType.expense)) {
    const categories = categoryGroupData.data.categories
      .filter((x) => x.group?.id === group.id && x.rolloverPeriod?.type === RolloverType.monthly)
      .map((x) => ({ id: x.id, label: x.name }))
      .map((x) => {
        if (x.id === settings?.rollupCategoryId) {
          rollupCategory = x;
        }
        return x;
      });

    rollupCategories.push({
      id: group.id,
      label: group.name,
      options: categories
    })
  };

  function saveSettings(enabled: boolean) {

    if (!enabled) {
      settings.enabled = false;
      return toolkitStorage.setItem('ReadyToAssignFeature', settings);
    }

    const value = {
      enabled: true,
      rollupCategoryId: selectedRollupCategory?.id,
      includeOverspentCategories: includeOverspentCategories
    }

    return toolkitStorage.setItem('ReadyToAssignFeature', value);
  };

  function canSave(): boolean {

    return isEnabled
      && selectedRollupCategory !== undefined;
  }

  async function handleEnabledToggle(value: boolean) {

    setEnabled(value);

    if (!value) {
      await saveSettings(value);
    }
  }

  async function handleOverspentToggle(value: boolean) {

    setIncludeOverspentCategories(value);
  }

  useEffect(() => {

    setEnabled(rollupCategory !== undefined);
    setSelectedRollupCategory(rollupCategory);

  }, []);

  const formatGroupLabel = (data: GroupedCategoryOption) => (
    <div className='group'>
      <span>{data.label}</span>
      <span className='groupBadge'>{data.options.length}</span>
    </div>
  );

  return (
    <div>
      <h3>Ready To Assign</h3>
      <Suspense fallback={<div>Loading...</div>}>
        <div className='setting'>
          <ToggleSwitch id="readyToAssignEnabled" checked={isEnabled} onChange={(checked) => handleEnabledToggle(checked)} />
          <div className='setting-details'>
            <span>Rollup Target Category</span>
            <Select
              value={selectedRollupCategory}
              onChange={setSelectedRollupCategory}
              options={rollupCategories}
              getOptionValue={(option) => option.id}
              formatGroupLabel={formatGroupLabel}
              isDisabled={!isEnabled}
            />

            <div className="toggle-row">
              <div>
                <label htmlFor="includeOverspentCategories">Include Overspent Categories</label>
                <ToggleSwitch id="includeOverspentCategories" checked={includeOverspentCategories} onChange={(checked) => handleOverspentToggle(checked)} />
              </div>
            </div>
          </div>

          <button onClick={() => saveSettings(isEnabled)} disabled={!canSave()}>
            Save
          </button>
        </div>
      </Suspense>
    </div>
  );
}