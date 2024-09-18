export interface MockUser {
    firstName: string;
    lastName: string;
    lastJoinedDate: string;
    role: string;
}

export const initialUsers: MockUser[] = [
    {firstName: "ელდარ", lastName: "ხუციშვილი", lastJoinedDate: "2024-01-15", role: "Admin"},
    {firstName: "ნინო", lastName: "აბულაძე", lastJoinedDate: "2024-02-03", role: "User"},
    {firstName: "მარიამ", lastName: "მთვარაძე", lastJoinedDate: "2024-03-12", role: "Moderator"},
    {firstName: "გიორგი", lastName: "დუმბაძე", lastJoinedDate: "2024-04-22", role: "Admin"},
    {firstName: "თამარ", lastName: "მაჭარაძე", lastJoinedDate: "2024-05-18", role: "User"},
    {firstName: "დავით", lastName: "კიკნაძე", lastJoinedDate: "2024-06-01", role: "User"},
    {firstName: "ნოდარ", lastName: "მახარაძე", lastJoinedDate: "2024-06-25", role: "Moderator"},
    {firstName: "ანასტასია", lastName: "გოგოლაძე", lastJoinedDate: "2024-07-10", role: "Admin"},
    {firstName: "ირაკლი", lastName: "გიორგაძე", lastJoinedDate: "2024-07-30", role: "User"},
    {firstName: "ლიზა", lastName: "სხირტლაძე", lastJoinedDate: "2024-08-15", role: "Moderator"},
    {firstName: "თეონა", lastName: "გოგობერიშვილი", lastJoinedDate: "2024-09-05", role: "User"},
    {firstName: "ლაშა", lastName: "ჩაჩანიძე", lastJoinedDate: "2024-09-16", role: "Admin"}
];


