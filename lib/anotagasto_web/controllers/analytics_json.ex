defmodule AnotagastoWeb.AnalyticsJSON do
  def daily(%{month: month, days: days}) do
    %{
      data: %{
        month: month,
        days:
          Enum.map(days, fn entry ->
            %{date: entry.date, total: to_int(entry.total), count: entry.count}
          end)
      }
    }
  end

  def summary(%{month: month, total: total, count: count, by_category: by_category}) do
    %{
      data: %{
        month: month,
        total: to_int(total),
        count: count,
        by_category:
          Enum.map(by_category, fn entry ->
            %{category: entry.category, total: to_int(entry.total), count: entry.count}
          end)
      }
    }
  end

  defp to_int(nil), do: 0
  defp to_int(%Decimal{} = d), do: Decimal.to_integer(d)
  defp to_int(n) when is_integer(n), do: n
end
