import { TyreC1Hard, TyreC2Hard, TyreC3Medium, TyreC4Soft, TyreC5Soft, TyreC6Soft, TyreIntermedium, TyreWet }from "@/components/TyreIcon";

export default function Page() {
    return (
        <div className="grid grid-cols-2 gap-4 bg-white">
            <TyreC1Hard />
            <TyreC2Hard />
            <TyreC3Medium />
            <TyreC4Soft />
            <TyreC5Soft />
            <TyreC6Soft />
            <TyreIntermedium />
            <TyreWet />

        </div>
    );
}