defmodule Anotagasto.Repo do
  use Ecto.Repo,
    otp_app: :anotagasto,
    adapter: Ecto.Adapters.Postgres

  import Ecto.Query

  def paginate(query, %Anotagasto.Pagination{page: page, page_size: page_size}) do
    offset = (page - 1) * page_size

    entries = all(from(q in query, limit: ^page_size, offset: ^offset))
    total = aggregate(query, :count)
    total_pages = ceil(total / page_size)

    %{entries: entries, page: page, page_size: page_size, total: total, total_pages: total_pages}
  end
end
