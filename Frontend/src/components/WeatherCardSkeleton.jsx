//Skeleton for weather card for ease of loading information on screen
function Block({ w, h, className = "" }) {
    return (
        <div className={`animate-pulse rounded-md ${className}`}
            style={{ width: w, height: h, background: "#232A35" }} />
    );
}

let backgroundColor = "#2A323D";

export default function WeatherCardSkeleton() {
    return (
        <div className="shrink-0 snap-center rounded-2x1 overflow-hidden f-body"
            style={{ width: "340px", background: "#1C222B", border: "1px solid #2A323D" }}>

            {/*Header*/}
            <div className="flex items-center justify-between px-6 pt-5 pb-3">
                <div className="flex flex-col gap-2">
                    <Block w="50px" h="10px" />
                    <Block w="110px" h="14px" />
                </div>
            </div>

            <div className="h-px mx-6" style={{ background: backgroundColor }} />

            {/*Hero*/}
            <div className="flex items-center justify-between px-6 py-6">
                <div className="flex flex-col gap-2">
                    <Block w="120px" h="70px" />
                    <Block w="160px" h="14px" />
                </div>
                <Block w="54px" h="14px" className="rounded-full" />
            </div>

            <div className="h-px mx-6" style={{ background: backgroundColor }} />

            {/*Hourly Strip*/}
            <div className="px-6 py-5">
                <Block w="90px" h="10px" className="mb-4" />
                <div className="flex items-end justify-between gap-2" style={{ height: "72px" }} >
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div key={i} className="flex flex-col items-center flex-1 h-full justify-end gap-2">
                            <Block w="18px" h="10px" />
                            <Block w="6px" h={`${20 + ((i * 13) % 50)}%`} className="rounded-full" />
                            <Block w="20px" h="8px" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="h-px mx-6" style={{ background: backgroundColor }} />

            {/*Readouts*/}
            <div className="px-6 py-5 grid grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <Block w="32px" h="32px" className="rounded-lg shrink-0" />
                        <div className="flex flex-col gap-1.5">
                            <Block w="45px" h="8px" />
                            <Block w="55px" h="12px" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="h-px mx-6" style={{ background: backgroundColor }} />

            {/* 7-day forecast */}
            <div className="px-6 py-5">
                <Block w="100px" h="10px" className="mb-4" />
                <div className="flex flex-col gap-4">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <Block w="36px" h="12px" />
                            <Block w="16px" h="16px" className="rounded-full" />
                            <Block w="20px" h="10px" />
                            <Block w="100%" h="4px" className="flex-1 rounded-full" />
                            <Block w="20px" h="10px" />
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}