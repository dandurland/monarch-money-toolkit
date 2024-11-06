
export const ManageGetCategoryGroups = `query ManageGetCategoryGroups {
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