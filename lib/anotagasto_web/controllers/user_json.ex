defmodule AnotagastoWeb.UserJSON do
  alias Anotagasto.Accounts.User

  @doc """
  Renders a list of users.
  """
  def index(%{
        entries: entries,
        page: page,
        page_size: page_size,
        total: total,
        total_pages: total_pages
      }) do
    %{
      data: for(expense <- entries, do: data(expense)),
      pagination: %{page: page, page_size: page_size, total: total, total_pages: total_pages}
    }
  end

  @doc """
  Renders a single user.
  """
  def show(%{user: user}) do
    %{data: data(user)}
  end

  defp data(%User{} = user) do
    %{
      id: user.id,
      name: user.name,
      password: user.password,
      phone_number: user.phone_number
    }
  end
end
