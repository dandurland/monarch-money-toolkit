const Spinner = () => {
  return (
    <svg className="h-11 w-11 animate-spin" viewBox="0 0 100 100">
      <circle
        fill="none"
        stroke-width="8"
        className="stroke-current opacity-40 text-widget-busy"
        cx="50"
        cy="50"
        r="40"
      />
      <circle
        fill="none"
        stroke-width="8"
        className="stroke-current text-lightBlue"
        stroke-dasharray="250"
        stroke-dashoffset="210"
        cx="50"
        cy="50"
        r="40"
      />
    </svg>
  );
};

export { Spinner };
