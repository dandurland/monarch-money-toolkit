import React from "react";
import { $LoadingSpinner, $WidgetLoading } from 'toolkit/components/styles/widget-styles.sc'

const Spinner = () => {
  return (
    <$WidgetLoading>
      <$LoadingSpinner />
    </$WidgetLoading>)
}

export default Spinner;