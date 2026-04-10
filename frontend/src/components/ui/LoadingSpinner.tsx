interface Props {
  fullPage?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-4",
};

export default function LoadingSpinner({ fullPage, size = "lg" }: Props) {
  const spinner = (
    <div
      className={`${sizes[size]} rounded-full border-indigo-200 border-t-indigo-600 animate-spin`}
    />
  );

  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        {spinner}
      </div>
    );
  }

  return spinner;
}
