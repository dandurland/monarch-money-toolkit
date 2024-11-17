import { rgba } from 'polished';
import lightThemeColors from './light';

const darkThemeColors = {
  ...lightThemeColors,
  text: '#FFFFFF',
  textLight: rgba('#FFFFFF', 0.7),
  textWhite: '#FFFFFF',
  white: '#0D2C5C',
  grayDark: '#43546E',
  gray: '#344867',
  grayLight: '#2F4464',
  grayFocus: '#263D5F',
  grayBackground: '#082043',
  grayLightBackground: '#082043',
  navy: '#0D2C5C',
  navyDark: '#082043',
  navyLight: '#263D5F',
  orangeText: lightThemeColors.orangeFocus,
  yellowText: lightThemeColors.yellowFocus,
  blueText: lightThemeColors.blueFocus,
  redText: lightThemeColors.redFocus,
  greenText: lightThemeColors.greenFocus,
  // Focus colors
  orangeFocus: rgba(lightThemeColors.orange, 0.4),
  yellowFocus: rgba(lightThemeColors.yellow, 0.4),
  blueFocus: rgba(lightThemeColors.blue, 0.4),
  redFocus: rgba(lightThemeColors.red, 0.4),
  greenFocus: rgba(lightThemeColors.green, 0.4),
  // Background colors
  orangeBackground: rgba(lightThemeColors.orange, 0.2),
  yellowBackground: rgba(lightThemeColors.yellow, 0.2),
  blueBackground: rgba(lightThemeColors.blue, 0.2),
  redBackground: rgba(lightThemeColors.red, 0.2),
  greenBackground: rgba(lightThemeColors.green, 0.2),
  limeBackground: rgba(lightThemeColors.lime, 0.2),
  pinkBackground: rgba(lightThemeColors.pink, 0.2),
  purpleBackground: rgba(lightThemeColors.purple, 0.2),
};

export default darkThemeColors;