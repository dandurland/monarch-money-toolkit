const Spinner = () => {
  return (
    <svg className="size-11 animate-spin" viewBox="0 0 100 100">
      <circle
        fill="none"
        strokeWidth="8"
        className="stroke-current text-widget-busy opacity-40"
        cx="50"
        cy="50"
        r="40"
      />
      <circle
        fill="none"
        strokeWidth="8"
        className="stroke-current text-lightBlue"
        strokeDasharray="250"
        strokeDashoffset="210"
        cx="50"
        cy="50"
        r="40"
      />
    </svg>
  );
};

export { Spinner };
