require 'rubygems'
require 'sinatra'
require 'erb'

get '/' do
  erb :index
end

get '/:page' do
  erb params[:page].to_sym
end