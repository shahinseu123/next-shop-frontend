export const Title = ({ 
  title, 
  size = "text-base", 
  textColor = "bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent" ,
  fontweight = "font-bold"
}: { 
  title: string; 
  size?: string; 
  textColor?: string; 
  fontweight?: string; 
}) => {
  return (
    <div className={`${size} ${textColor} ${fontweight} mb-1`}>
      {title}
    </div>
  );
};