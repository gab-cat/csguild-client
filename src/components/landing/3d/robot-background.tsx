import Spline from '@splinetool/react-spline/next';

export default function RobotBackground() {
  return (
    <div className="absolute -right-[10vw] top-0 w-[80vw] h-full z-0 hidden lg:block">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-violet-500/20 to-purple-500/20 rounded-3xl blur-3xl opacity-30" />
      <Spline
        scene="https://prod.spline.design/awBSaOn9261Q9L9g/scene.splinecode"
        className="w-full h-full"
      />
    </div>
  );
}
