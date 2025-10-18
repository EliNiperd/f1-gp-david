import { TyreC1, TyreC2, TyreC3, TyreC4, TyreC5, TyreC6, TyreIntermedium, TyreWet }from "@/components/TyreIcon";

export default function Page() {
    return (
        <div className="grid grid-cols-2 gap-4">
            <TyreC1 />
            <TyreC2 />
            <TyreC3 />
            <TyreC4 />
            <TyreC5 />
            <TyreC6 />
            <TyreIntermedium />
            <TyreWet />

        </div>
    );
}