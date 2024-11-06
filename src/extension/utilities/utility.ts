import $  from 'jquery';

export function isMMReady() {

    const result = (
        typeof $ !== 'undefined' &&
        !$('[class^="LoadingSpinnerWithText__LoadingContainer"]').length
      );

    return result;
}