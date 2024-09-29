defmodule TanksElixir.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      TanksElixirWeb.Telemetry,
      TanksElixir.Repo,
      {DNSCluster, query: Application.get_env(:tanks_elixir, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: TanksElixir.PubSub},
      # Start the Finch HTTP client for sending emails
      {Finch, name: TanksElixir.Finch},
      # Start a worker by calling: TanksElixir.Worker.start_link(arg)
      # {TanksElixir.Worker, arg},
      # Start to serve requests, typically the last entry
      TanksElixirWeb.Endpoint
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: TanksElixir.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    TanksElixirWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
