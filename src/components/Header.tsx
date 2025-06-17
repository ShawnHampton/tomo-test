interface Props extends React.PropsWithChildren {
    header: string
}

export const Header = ({header, children}: Props) => {
  return (
    <header className="flex flex-row justify-between items-center bg-gray-800 text-white p-4">
      <h1 className="text-2xl font-bold">{header}</h1>
      {children}
    </header>
  );
}