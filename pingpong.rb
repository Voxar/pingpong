require 'rubygems'
require 'sinatra'
require 'erb'

get '/' do
  params.update(:player1 => "Player 1", :player2 => "Player 2")
  erb :index
end

get '/play/:players' do
  p1, p2 = params[:players].split(/ |%20|,/)
  params.update(:player1 => p1, :player2 => p2)
  erb :index
end

get '/play/:player1/:player2' do
  erb :index
end
