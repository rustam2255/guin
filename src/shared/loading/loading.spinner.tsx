

type LoadingSpinnerProps = {
  fullScreen?: boolean;
  text?: string;
  size?: "sm" | "md" | "lg" | "xl";
};

export default function LoadingSpinner({
  fullScreen = false,
  text = "Yuklanmoqda...",
  size = "md",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: {
      outer: "w-10 h-10",
      inner: "w-5 h-5",
      text: "text-sm",
    },
    md: {
      outer: "w-14 h-14",
      inner: "w-7 h-7",
      text: "text-base",
    },
    lg: {
      outer: "w-20 h-20",
      inner: "w-10 h-10",
      text: "text-lg",
    },
    xl: {
      outer: "w-24 h-24",
      inner: "w-12 h-12",
      text: "text-xl",
    },
  };

  const currentSize = sizeClasses[size];

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative flex items-center justify-center">
        <div
          className={`
            ${currentSize.outer}
            rounded-full
            border-[4px]
            border-t-transparent
            animate-spin
            shadow-lg
          `}
          style={{
            borderColor: "rgba(15,95,194,0.18)",
            borderTopColor: "transparent",
            borderRightColor: "rgba(3,186,107,0.95)",
            borderBottomColor: "rgba(15,95,194,0.95)",
            borderLeftColor: "rgba(3,186,107,0.35)",
          }}
        />

        <div
          className={`
            absolute
            ${currentSize.inner}
            rounded-full
            animate-pulse
          `}
          style={{
            background:
              "linear-gradient(135deg, rgba(15,95,194,1) 0%, rgba(3,186,107,1) 100%)",
            boxShadow: "0 0 22px rgba(15,95,194,0.25)",
          }}
        />
      </div>

      <div className="flex flex-col items-center gap-1">
        <p
          className={`
            ${currentSize.text}
            font-semibold
            text-center
          `}
          style={{ color: "rgba(15,95,194,1)" }}
        >
          {text}
        </p>

        <div className="flex items-center gap-1">
          <span
            className="w-2 h-2 rounded-full animate-bounce"
            style={{
              backgroundColor: "rgba(15,95,194,1)",
              animationDelay: "0ms",
            }}
          />
          <span
            className="w-2 h-2 rounded-full animate-bounce"
            style={{
              backgroundColor: "rgba(3,186,107,1)",
              animationDelay: "150ms",
            }}
          />
          <span
            className="w-2 h-2 rounded-full animate-bounce"
            style={{
              backgroundColor: "rgba(15,95,194,1)",
              animationDelay: "300ms",
            }}
          />
        </div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm p-4">
        {content}
      </div>
    );
  }

  return (
    <div className="w-full min-h-[220px] sm:min-h-[260px] flex items-center justify-center rounded-3xl bg-white p-6 sm:p-8 shadow-sm">
      {content}
    </div>
  );
}