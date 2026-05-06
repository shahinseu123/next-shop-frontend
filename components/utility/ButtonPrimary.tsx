interface Props {
    title: string;
    bgColor?: string; // Used for solid background OR text color in 'text' variant
    icon?: React.ReactNode;
    onClick: () => void;
    variant?: 'solid' | 'outline' | 'text'; // 'text' is the key variant from Vuetify
    size?: 'sm' | 'md' | 'lg';
}

export const ButtonPrimary = ({ 
    title, 
    bgColor = 'transparent', 
    icon, 
    onClick,
    variant = 'solid', // Default to solid as you had
    size = 'md'
}: Props) => {
    
    const sizeClasses = {
        sm: 'px-3 py-1 text-sm',
        md: 'px-6 py-2 text-base',
        lg: 'px-8 py-3 text-lg'
    };

    // Base classes that are common
    const baseClasses = "rounded font-medium transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    // Conditional classes based on variant
    const variantClasses = {
        // Your original solid button
        solid: `text-white shadow-md rounded-md hover:shadow-lg focus:ring-[${bgColor}]`,
        // Like Vuetify's 'outlined'
        outline: `border-2 bg-transparent hover:bg-gray-50 focus:ring-[${bgColor}]`,
        // Like Vuetify's 'text' - NO background, NO shadow
        text: `bg-transparent shadow-none hover:bg-gray-100 focus:ring-[${bgColor}]`,
    };

    return (
        <div 
            className={`
                cursor-pointer
                ${baseClasses}
                ${sizeClasses[size]}
                ${variant === 'text' ? 'px-2' : sizeClasses[size]} // Less padding for text variant
                ${variantClasses[variant]}
            `}
            style={{ 
                // For solid: background color
                ...(variant === 'solid' && { backgroundColor: bgColor }),
                // For outline and text: text color and border color
                ...((variant === 'outline' || variant === 'text') && { 
                    color: bgColor,
                    borderColor: variant === 'outline' ? bgColor : 'transparent'
                }),
            }}
            onClick={onClick}
        >
            {icon && <span>{icon}</span>}
            <span className="font-medium"> {title}</span>
        </div>
    );
};