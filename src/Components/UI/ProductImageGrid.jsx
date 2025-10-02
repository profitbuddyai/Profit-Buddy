import { v4 as uuidv4 } from "uuid";
import { formatNumberWithCommas } from "../../Utils/NumberUtil";

const placeholder =
    "https://via.placeholder.com/300?text=No+Image"; // your fallback placeholder

const ProductImageGrid = ({ images = [], listPrice = 0 , className }) => {
    const hasMainImage = Boolean(images?.[0]);

    let mainImage = hasMainImage ? images[0] : images[0] || placeholder;

    let sideImgs = hasMainImage ? images.slice(1, 4).filter(Boolean) : images.slice(0, 3).filter(Boolean);

    while (sideImgs.length < 3) {
        sideImgs.push(sideImgs[sideImgs.length - 1] || placeholder);
    }

    return (
        // <div
        //     className="grid gap-2   !h-full max-w-[220px] min-w-[220px]"
        //     style={{
        //         gridTemplateColumns: "repeat(3, auto)",
        //         gridTemplateRows: "repeat(3, auto)",
        //     }}
        // >

            <div className={`relative w-[220px] max-w-[220px] h-auto min-h-full bg-white border border-border rounded-[8px] overflow-hidden p-1 ${className}`}>
                <img
                    src={mainImage || placeholder}
                    alt="product"
                    className="object-contain w-full h-full"
                />
                {listPrice > 0 && (
                    <div className="absolute z-20 bottom-1.5 right-1.5 bg-primary px-3 py-1 rounded-md border shadow-xl border-secondary/40  text-base font-medium  text-secondary ">
                        {formatNumberWithCommas(listPrice)}
                    </div>
                )}
            </div>
        // </div>
    );
}

export default ProductImageGrid