defmodule Anotagasto.Expenses.Repo do
  import Ecto.Query

  alias Anotagasto.Expenses.Expense
  alias Anotagasto.Pagination
  alias Anotagasto.Repo

  def list_expenses_by_user(user_id, %Pagination{} = pagination) do
    from(e in Expense, where: e.user_id == ^user_id, order_by: [desc: e.inserted_at])
    |> Repo.paginate(pagination)
  end
end
