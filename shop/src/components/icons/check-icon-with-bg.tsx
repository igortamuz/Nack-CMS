const CheckIconWithBg: React.FC<React.SVGAttributes<{}>> = ({
  width = 20,
  height = 20,
  ...props
}) => {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="10.5" cy="9.5" r="6.5" fill="white" />
      <path
        d="M10 0C4.48622 0 0 4.48622 0 10C0 15.5138 4.48622 20 10 20C15.5138 20 20 15.5138 20 10C20 4.48622 15.5138 0 10 0ZM15.589 7.36842L9.198 13.7093C8.82206 14.0852 8.22055 14.1103 7.81955 13.7343L4.43609 10.6516C4.03509 10.2757 4.01003 9.64912 4.3609 9.24812C4.73684 8.84712 5.36341 8.82206 5.76441 9.198L8.44612 11.6541L14.1604 5.93985C14.5614 5.53885 15.188 5.53885 15.589 5.93985C15.99 6.34085 15.99 6.96742 15.589 7.36842Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default CheckIconWithBg;
