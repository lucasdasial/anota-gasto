defmodule Anotagasto.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :name, :string, null: false
      add :password, :string, null: false
      add :phone_number, :string, null: false

      timestamps(type: :utc_datetime)
    end

    create unique_index(:users, [:phone_number])
    create index(:users, [:name])
  end
end
