type PlanSeed = {
    type: 'free'|'monthly'|'annual';
    name: string;
    price: number;
    currency: 'USD'|'COP'|'ARS';
    features: string;
};

export const  PlanFreeMonthlyAnnual: PlanSeed[] = [
    {
        name: "Free Plan",
        price: 0,
        type: "free",
        currency: "ARS",
        features: "Pin creation limit. Limit of likes per post, saves, and comments."
    },
    {
        name: "Monthly Plan",
        price: 0.10,
        type: "monthly",
        currency: "ARS",  
        features: "Pin creation limit. Limit of likes per post, saves, and comments."
    },
    {
        name: "Annual Plan",
        price: 0.30,
        type: "annual",
        currency: "ARS",  
        features: "Pin creation limit. Limit of likes per post, saves, and comments."
    }
]

