import clsx from "clsx";
import ButtonLoader from '../Loaders/ButtonLoader'

const Button = ({
    label = '',
    variant = 'accent',
    size = 'small',
    corner = "small",
    action = () => { },
    loading = false,
    className = '',
    type = 'button',
    disabled = false,
}) => {

    const variantsClasses = {
        primary: `border-[1.5px] border-primary bg-primary text-secondary`,
        secondary: `border-[1.5px] border-secondary bg-secondary text-primary`,
        accent: `border-[1.5px] border-accent bg-accent text-primary`,
        danger: `border-[1.5px] border-red-600 bg-red-600 text-white`,
        white: `border-[1.5px] border-white bg-white text-red-600`,
        warn: `border-[1.5px] border-yellow-600 bg-yellow-600 text-white`,
        disable: `border-[1.5px] border-border/10 bg-border/80 text-secondary/50 !cursor-not-allowed hover:opacity-100`,
        outline: `border-[1.5px] border-border bg-primary text-secondary/70 hover:border-secondary/30 `,
        text: `text-secondary/70`,
        transparent: `bg-transparent border-[1.5px] border-transparent `
    }

    const sizeClasses = {
        large: `py-2 px-6 text-lg font-semibold`,
        medium: `!min-h-10 px-6 text-[15px]/[15px] font-medium`,
        small: `!h-8 px-4 w-max text-sm font-medium`,
    }

    const cornerClasses = {
        none: `rounded-none`,
        small: `rounded-md`,
        full: `rounded-full`
    }


    return (
        <button
            type={type}
            onClick={action}
            disabled={loading || disabled}
            className={clsx(
                "fontDmmono relative cursor-pointer hover:opacity-85 box-border  ",
                disabled ? variantsClasses?.disable : variantsClasses?.[variant],
                sizeClasses?.[size],
                cornerClasses?.[corner],
                className
            )}
        >
            {label && (
                <span className={clsx(loading ? "invisible" : "visible", "text-nowrap")}>
                    {label}
                </span>
            )}

            {loading && (
                <span className="absolute inset-0 flex items-center justify-center">
                    <ButtonLoader />
                </span>
            )}
        </button>
    )
}

export default Button