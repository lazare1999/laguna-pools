export interface MockClient {
    firstName: string;
    lastName: string;
    expirationDate: string;
    attended: boolean;
    plan: string;
    sessions: number;
    notes: string;

    [key: string]: any;
}

export const initialClients: MockClient[] = [
    {
        firstName: "თეა",
        lastName: "კობიაშვილი",
        expirationDate: "2025-01-10",
        attended: true,
        plan: "Premium",
        sessions: 10,
        notes: "No issues",
    },
    {
        firstName: "ლაშა",
        lastName: "ბერიძე",
        expirationDate: "2024-09-20",
        attended: false,
        plan: "Basic",
        sessions: 5,
        notes: "Overdue payment",
    },
    {
        firstName: "ნანა",
        lastName: "გრიგალაშვილი",
        expirationDate: "2024-11-05",
        attended: true,
        plan: "Standard",
        sessions: 8,
        notes: "Requires extra sessions",
    },
    {
        firstName: "ირაკლი",
        lastName: "მაჭავარიანი",
        expirationDate: "2024-08-30",
        attended: true,
        plan: "Premium",
        sessions: 15,
        notes: "Outstanding performance",
    },
    {
        firstName: "ლევან",
        lastName: "ქობულაძე",
        expirationDate: "2024-12-01",
        attended: false,
        plan: "Basic",
        sessions: 3,
        notes: "Needs to reschedule",
    },
    {
        firstName: "ეკატერინე",
        lastName: "მანგლაძე",
        expirationDate: "2025-02-14",
        attended: true,
        plan: "Premium",
        sessions: 20,
        notes: "Long-term client",
    },
    {
        firstName: "ნიკოლოზ",
        lastName: "ზალდასტანიშვილი",
        expirationDate: "2024-10-30",
        attended: false,
        plan: "Standard",
        sessions: 7,
        notes: "Rescheduled next session",
    },
    {
        firstName: "მაია",
        lastName: "ჩიქოვანი",
        expirationDate: "2025-03-12",
        attended: true,
        plan: "Basic",
        sessions: 4,
        notes: "New client",
    },
    {
        firstName: "გიორგი",
        lastName: "ჩხეიძე",
        expirationDate: "2024-12-25",
        attended: false,
        plan: "Premium",
        sessions: 10,
        notes: "Pending renewal",
    },
    {
        firstName: "ნინო",
        lastName: "სარალიძე",
        expirationDate: "2024-11-22",
        attended: true,
        plan: "Standard",
        sessions: 9,
        notes: "Requested feedback",
    },
    {
        firstName: "ვახტანგ",
        lastName: "ალავიძე",
        expirationDate: "2024-09-30",
        attended: false,
        plan: "Basic",
        sessions: 6,
        notes: "Vacation leave",
    },
    {
        firstName: "ხათუნა",
        lastName: "მაჩაიძე",
        expirationDate: "2024-12-18",
        attended: true,
        plan: "Premium",
        sessions: 12,
        notes: "Will renew soon",
    },
    {
        firstName: "დავით",
        lastName: "ხაბეიშვილი",
        expirationDate: "2024-10-12",
        attended: true,
        plan: "Basic",
        sessions: 5,
        notes: "Missed last session",
    },
    {
        firstName: "თამარ",
        lastName: "ბასილაძე",
        expirationDate: "2024-11-15",
        attended: true,
        plan: "Standard",
        sessions: 7,
        notes: "Recommended for advanced sessions",
    },
    {
        firstName: "ალექსანდრე",
        lastName: "წერეთელი",
        expirationDate: "2024-08-15",
        attended: false,
        plan: "Premium",
        sessions: 11,
        notes: "Requested refund",
    }
];
