defmodule TanksElixir.Repo do
  use Ecto.Repo,
    otp_app: :tanks_elixir,
    adapter: Ecto.Adapters.Postgres
end
