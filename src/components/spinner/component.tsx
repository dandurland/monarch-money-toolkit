import React from "react";
import { $LoadingSpinner, $WidgetLoading } from 'toolkit/components/styles/widget-styles.sc'
import $FlexContainer from 'toolkit/components/styles/flex-container.sc';

/*const Spinner = () => {
  return (
    <$WidgetLoading>
      <$LoadingSpinner />
    </$WidgetLoading>)
}*/


const Spinner = () => {
  return (
    <$FlexContainer justifyCenter margin='xlarge'>
      <$LoadingSpinner />
    </$FlexContainer>
  )
};

export default Spinner;