class AdvertsController < ApplicationController
  def index
    @ads = Advert.where(user: current_user)
    @ad = Advert.new
  end

  def create
    @ads = Advert.where(user: current_user)
    @ad = Advert.new(ad_params)
    @ad.user = current_user
    @ad.state = "pending"
    if @ad.save
      redirect_to adverts_path
    else
      render :index
    end
  end

  def update
    @ads = Advert.where(user: current_user)
    @ad = Advert.find(params[:id])
    @user = @ad.user
    @ad.update(state: params[:state])
    if @ad.save
    	redirect_to adverts_path
    else
    	render :index
    end
  end

  def destroy
    @ad = Advert.find(params[:id])
    @ad.destroy
    redirect_to adverts_path
  end

  private

  def ad_params
    params.require(:advert).permit(:title, :url, :size, :address, :price, :comment)
  end
end
