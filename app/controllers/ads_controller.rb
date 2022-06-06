class AdsController < ApplicationController
  def index
    @ads = Ad.where(user: current_user)
    @ad = Ad.new
    # @user = current_user
  end

  def create
    raise
    @ad = Ad.new(ad_params)
    @ad.user = current_user
    @ad.state = "pending"
    if @ad.save
      redirect_to user_ads_path(current_user)
    else
      render "ads/index"
    end
  end

  def update
    @ad = Ad.find(params[:id])
    @user = @ad.user
    @ad.update(state: params[:state])
    if @ad.save
    		redirect_to user_ads_path(@user)
    else
    		render "ads/index"
    end
  end

  def destroy
    @ad = Ad.find(params[:id])
    @ad.destroy
    redirect_to user_ads_path(current_user)
  end

  private

  def ad_params
    params.require(:ad).permit(:title, :url, :size, :address, :price, :comment, :state)
  end
end
