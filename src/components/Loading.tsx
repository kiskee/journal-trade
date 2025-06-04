import { Card } from "./ui/card";

type Props = {
  text: string;
};

const Loading = (props: Props) => {
  return (
    <Card className="w-full h-full bg-neutral-800 shadow-lg border-blue-600 shadow-blue-700">
      <div className="flex flex-col justify-center items-center w-full h-full text-center p-4">
        <h1 className="text-4xl font-bold text-blue-500 mb-4 animate-pulse">
          {props.text}
        </h1>
        <div className="flex justify-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </Card>
  );
};

export default Loading;
