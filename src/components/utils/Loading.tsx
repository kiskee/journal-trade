interface LoadingProps {
  text: string;
}

export default function Loading({ text }: LoadingProps) {
  return (
    <div className="text-center p-4">
      <h1 className="text-4xl font-bold text-white mb-4 animate-pulse pb-8">
        {text}
      </h1>
      <div className="flex justify-center">
        {/* Spinner animado con Tailwind */}
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-12"></div>
      </div>
    </div>
  );
}
