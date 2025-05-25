export default function OddsCard({ data }: { data: any }) {
  return (
    <div className="border rounded-lg p-4 shadow bg-white">
      <h2 className="text-lg font-semibold">{data.sport_title}</h2>
      <p className="text-sm text-gray-500">{data.commence_time}</p>
      <ul className="mt-2">
        {data.bookmakers?.[0]?.markets?.[0]?.outcomes?.map((team: any) => (
          <li key={team.name}>
            {team.name}: <strong>{team.price}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
