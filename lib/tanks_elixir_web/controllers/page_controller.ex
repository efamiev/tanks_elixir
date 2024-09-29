defmodule TanksElixirWeb.PageController do
  use TanksElixirWeb, :controller

  def home(conn, _params) do
    # The home page is often custom made,
    # so skip the default app layout.
    render(conn, :home, layout: {TanksElixirWeb.Layouts, :app})
  end
end
