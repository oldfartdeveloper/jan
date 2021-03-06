# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# Configures the endpoint
config :jan, Jan.Endpoint,
  url: [host: "localhost"],
  root: Path.dirname(__DIR__),
  secret_key_base: "D00YAk4i72ORlfZxIx9/oewb6xUxNVO/Vq1EW6a/d5U8wSLvbKvIktoAuTvWKG6U",
  render_errors: [accepts: ~w(html json)],
  pubsub: [name: Jan.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"

# Configure phoenix generators
config :phoenix, :generators,
  migration: true,
  binary_id: false


config :jan,
  admin_user: System.get_env("ADMIN_USER"),
  admin_password: System.get_env("ADMIN_PASS")
